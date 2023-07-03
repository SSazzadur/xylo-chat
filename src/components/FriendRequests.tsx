"use client";

import { CheckIcon, UserPlus, X } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";

interface FriendRequestsProps {
	incomingFriendRequests: IncomingFriendRequest[];
	sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {
	const [friendReqs, setFriendReqs] = useState<IncomingFriendRequest[]>(incomingFriendRequests);

	return (
		<>
			{friendReqs.length === 0 ? (
				<p className="text-sm text-zinc-500">Nothing to show here...</p>
			) : (
				friendReqs.map(req => (
					<div className="flex gap-4 items-center" key={req.senderId}>
						<UserPlus className="text-black" />
						{/* <p className="font-medium text-lg">{req.senderName}</p> */}
						<div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
							<div className="relative h-8 w-8 bg-gray-50">
								<Image
									fill
									referrerPolicy="no-referrer"
									className="rounded-full"
									src={req.senderImage || ""}
									alt="profile_picture"
								/>
							</div>
							<span className="sr-only">Incoming friend request</span>
							<div className="flex flex-col">
								<span aria-hidden="true">{req.senderName}</span>
								<span className="text-xs text-zinc-400" aria-hidden="true">
									{req.senderEmail}
								</span>
							</div>
						</div>
						<button
							aria-label="Accept Friend"
							className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
						>
							<CheckIcon className="font-semibold text-white w-3/4 h-3/4" />
						</button>

						<button
							aria-label="Deny Friend"
							className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
						>
							<X className="font-semibold text-white w-3/4 h-3/4" />
						</button>
					</div>
				))
			)}
		</>
	);
};

export default FriendRequests;
