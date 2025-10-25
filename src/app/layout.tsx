import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
	title: "Blind Sound",
	description:
		"Развивайте способность определять направление звука с помощью интерактивного тренажера",
	keywords:
		"слух, локализация звука, тренажер, аудиальные навыки, пространственный слух",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ru">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
