"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
	const [isSigningOut, setIsSigingOut] = useState<boolean>(false);

	const handleSignOut = async () => {
		setIsSigingOut(true);
		try {
			await signOut();
		} catch (error) {
			toast.error("There was a problem signing out");
		} finally {
			setIsSigingOut(false);
		}
	};

	return (
		<Button variant="ghost" onClick={handleSignOut} isLoading={isSigningOut}>
			{isSigningOut ? null : <LogOut className="w-4 h-4" />}
		</Button>
	);
};

export default SignOutButton;
