import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/helpers/redis";
import FriendRequests from "@/components/FriendRequests";

const page = async () => {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	const incomingSenderIds = (await fetchRedis(
		"smembers",
		`user:${session.user.id}:incoming_friend_requests`
	)) as string[];

	const incomingFriendRequests = await Promise.all(
		incomingSenderIds.map(async senderId => {
			const sender = (await fetchRedis("get", `user:${senderId}`)) as string;

			const senderParsed = JSON.parse(sender) as User;

			return {
				senderId,
				senderEmail: senderParsed.email,
				senderName: senderParsed.name,
				senderImage: senderParsed.image,
			};
		})
	);

	return (
		<main className="pt-8">
			<h1 className="font-bold text-5xl mb-8">Friend Requests</h1>
			<div className="flex flex-col gap-4">
				<FriendRequests
					sessionId={session.user.id}
					incomingFriendRequests={incomingFriendRequests}
				/>
			</div>
		</main>
	);
};

export default page;
