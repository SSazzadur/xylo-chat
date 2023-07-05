import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Message, messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
	try {
		const { text, chatId }: { text: string; chatId: string } = await req.json();
		const session = await getServerSession(authOptions);

		if (!session) return new Response("Unauthorized", { status: 401 });

		const [userId1, userId2] = chatId.split("--");

		if (session.user.id !== userId1 && session.user.id !== userId2)
			return new Response("Unauthorized", { status: 401 });

		const friendId = session.user.id === userId1 ? userId2 : userId1;

		const friendList = (await fetchRedis(
			"smembers",
			`user:${session.user.id}:friends`
		)) as string[];
		const isFriend = friendList.includes(friendId);

		if (!isFriend) return new Response("Unauthorized", { status: 401 });

		const senderString = (await fetchRedis("get", `user:${session.user.id}`)) as string;
		const sender = JSON.parse(senderString) as User;

		const timeStamp = Date.now();
		const messageData: Message = {
			id: nanoid(),
			senderId: session.user.id,
			receiverId: friendId,
			text,
			timeStamp,
		};
		const message = messageValidator.parse(messageData);

		// Notify all conneceted chat room clients
		pusherServer.trigger(toPusherKey(`chat:${chatId}`), "incoming_message", message);

		pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
			...message,
			senderImage: sender.image,
			senderName: sender.name,
		});

		// sending the message
		await db.zadd(`chat:${chatId}:messages`, {
			score: timeStamp,
			member: JSON.stringify(message),
		});

		return new Response("OK");
	} catch (error) {
		if (error instanceof Error) {
			return new Response(error.message, { status: 500 });
		}
		return new Response("Internal Server Error", { status: 500 });
	}
}