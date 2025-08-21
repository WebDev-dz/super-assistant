import React, { useRef, useState } from "react";
import { View, Text, Pressable, useWindowDimensions, Image } from "react-native";
import PagerView from "react-native-pager-view";
import { router } from "expo-router";

const SLIDES = [
	{
		title: "Meet Taskify - Your Goal Conquering Sidekick!",
		description:
			"Embark on a journey of achievement and transformation with Taskify. Say hello to a more organized, productive, and fulfilled you.",
	},
	{
		title: "Track Your Progress, and Achieve Your Dreams!",
		description:
			"Stay focused on your goals and watch your dreams come true. Taskify empowers you to track progress every step of the way.",
	},
	{
		title: "Unlock Your AI-Powered Goals Planner Now!",
		description:
			"Tap into the genius of AI and unlock a world of endless possibilities. Achieving your goals has never been more intuitive and efficient.",
	},
];

export default function OnboardingScreen() {
	const pagerRef = useRef<PagerView>(null);
	const [pageIndex, setPageIndex] = useState(0);
	const { width } = useWindowDimensions();

	const isLast = pageIndex === SLIDES.length - 1;

	const handleContinue = () => {
		if (isLast) {
			router.replace("/(auth)/get-started");
			return;
		}
		pagerRef.current?.setPage(pageIndex + 1);
	};

	const handleSkip = () => {
		pagerRef.current?.setPage(SLIDES.length - 1);
	};

	return (
		<View className="flex-1 bg-white">
			<PagerView
				ref={pagerRef}
				className="flex-1"
				initialPage={0}
				onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
			>
				{SLIDES.map((slide, idx) => (
					<View key={idx.toString()} className="flex-1 justify-start">
						{/* Placeholder image area */}
						<View className="bg-[#FF7A33] rounded-b-3xl pt-4 pb-6 px-4 items-center">
							<Image
								source={{ uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=" }}
								resizeMode="cover"
								className="w-full h-[360px] rounded-xl bg-white"
							/>
						</View>

						{/* Text content */}
						<View className="flex-1 px-6 pt-6">
							<Text className="text-2xl font-extrabold text-center mb-3 text-[#111111]">{slide.title}</Text>
							<Text className="text-sm leading-6 text-center text-[#777777] mb-5">{slide.description}</Text>

							{/* Dots indicator */}
							<View className="flex-row justify-center items-center gap-2 mb-5">
								{SLIDES.map((_, dotIndex) => (
									<View
										key={`dot-${dotIndex}`}
										className={`h-2 w-2 rounded-full bg-neutral-200 ${dotIndex === pageIndex ? 'bg-[#FF7A33] w-[18px]' : ''}`}
									/>
								))}
							</View>

							{/* Actions */}
							{!isLast ? (
								<View className="flex-row gap-4 justify-between px-3 mt-2">
									<Pressable onPress={handleSkip} className="flex-1 h-13 rounded-full items-center justify-center bg-neutral-100">
										<Text className="text-base font-bold text-[#111111]">Skip</Text>
									</Pressable>
									<Pressable onPress={handleContinue} className="flex-1 h-13 rounded-full items-center justify-center bg-[#FF7A33]">
										<Text className="text-base font-bold text-white">Continue</Text>
									</Pressable>
								</View>
							) : (
								<Pressable onPress={handleContinue} className="h-13 rounded-full items-center justify-center bg-[#FF7A33] self-center" style={{ width: width - 48 }}>
									<Text className="text-base font-bold text-white">Let's Get Started</Text>
								</Pressable>
							)}
						</View>
					</View>
				))}
			</PagerView>
		</View>
	);
}

