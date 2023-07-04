import { z } from "zod";

export const messageValidator = z.object({
	id: z.string(),
	senderId: z.string(),
	receiverId: z.string(),
	text: z.string(),
	timeStamp: z.string(),
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;