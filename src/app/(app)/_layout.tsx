/* eslint-disable react/no-unstable-nested-components */
import { Link, Tabs } from "expo-router";
import React from "react";

import { Pressable, Text } from "@/components/ui";
import {
	Feed as FeedIcon,
	Settings as SettingsIcon,
	Style as StyleIcon,
} from "@/components/ui/icons";

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Feed",
					tabBarIcon: ({ color }) => <FeedIcon color={color} />,
					headerRight: () => <CreateNewPostLink />,
					tabBarButtonTestID: "feed-tab",
				}}
			/>

			<Tabs.Screen
				name="style"
				options={{
					title: "Style",
					headerShown: false,
					tabBarIcon: ({ color }) => <StyleIcon color={color} />,
					tabBarButtonTestID: "style-tab",
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					headerShown: false,
					tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
					tabBarButtonTestID: "settings-tab",
				}}
			/>
		</Tabs>
	);
}

const CreateNewPostLink = () => {
	return (
		<Link href="/feed/add-post" asChild>
			<Pressable>
				<Text className="px-3 text-primary-300">Create</Text>
			</Pressable>
		</Link>
	);
};
