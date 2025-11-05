import { BookOpenIcon } from '@/components/ui/BookOpenIcon';
import { ClipboardIcon } from '@/components/ui/ClipboardIcon';
import { FolderOpenIcon } from '@/components/ui/FolderOpenIcon';
import { HouseIcon } from '@/components/ui/HouseIcon';
import { ZapIcon } from '@/components/ui/ZapIcon';

// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_BASE_URL ||
    'http://localhost:3000', // fallback only for local dev
  ENDPOINTS: {
    AUTH: {
      STUDENT_SIGNIN: '/api/auth/student/signin',
      STUDENT_SIGNUP: '/api/auth/student/signup',
      SIGNOUT: '/api/auth/signout',
    },
    STUDENT: {
      PROJECTS: '/api/student/project',
    },
    ACCOUNT_TYPE: '/api/account-type',
    COLLEGE: '/api/college',
  },
} as const;

export const NavItems = [
  { name: "Home", href: "/home", icon: HouseIcon },
  { name: "Hackathon", href: "/home/hackathon", icon: ZapIcon },
  { name: "Resources", href: "/home/resources", icon: BookOpenIcon },
  { name: "Resume", href: "/home/resume", icon: ClipboardIcon },
  { name: "Projects", href: "/home/projects", icon: FolderOpenIcon },
];

export const quotes = [
  "Discipline beats motivation every damn day.",
  "The earlier you start, the longer you get to enjoy the results.",
  "Don’t adapt to the energy in the room. Influence it.",
  "If it was easy, everyone would’ve done it already.",
  "Growth feels lonely before it feels rewarding.",
  "Be addicted to improvement, not approval.",
  "Sometimes not getting what you want is the best thing that can happen.",
  "Stop waiting for the right time. It’s never been about time — it’s about you.",
  "You can’t pour from an empty cup. Take care of yourself first.",
  "A lion doesn’t lose sleep over the opinion of sheep.",
  "Dream big. Work quietly. Shock everyone.",
  "You don’t need more time — you need more focus.",
  "The grind includes Friday nights and early mornings.",
  "You can’t climb the ladder of success with your hands in your pockets.",
  "It’s okay to outgrow people who don’t grow with you.",
  "The most dangerous thing is getting comfortable doing nothing.",
  "No one is coming to save you — get up and make it happen.",
  "Work until your idols become your rivals.",
  "You become unstoppable when you work on things people can’t take away — mindset, character, and skill.",
  "Some people dream of success, others wake up and work for it.",
  "Success hits different when no one thought you could do it.",
  "Progress is progress — even if it’s one small step a day.",
  "Fall seven times, stand up eight.",
  "If you’re not embarrassed by who you were last year, you’re not growing.",
  "Comfort is a slow death. Choose growth instead."
];


export const posts = [
  {
    id: 1,
    username: "Arjun Patel",
    profileIcon: "UserIcon",
    content: "Just wrapped up our hackathon project — sleepless nights finally paid off! 🚀",
    image: { height: 250, width: 400 },
    likes: 132,
    timeAgo: "2h ago",
    comments: [
      { id: 1, username: "Riya Sharma", text: "Broo this is amazing 🔥🔥" },
      { id: 2, username: "Manav", text: "Send link of your project!" },
      { id: 3, username: "Kritika", text: "We need a demo video 👀" },
      { id: 4, username: "Raghav", text: "Proud of you bro!" },
      { id: 5, username: "Mehul", text: "Insane effort 👏" },
      { id: 6, username: "Neha", text: "Teamwork makes the dream work 💪" },
      { id: 7, username: "Ishaan", text: "When’s your next hack?" },
      { id: 8, username: "Anaya", text: "Such a vibe!" },
      { id: 9, username: "Harsh", text: "This deserves more recognition" },
      { id: 10, username: "Zara", text: "Love this energy" },
      { id: 11, username: "Ravi", text: "Legend 😎" },
      { id: 12, username: "Nisha", text: "We stan developers who don’t sleep" },
      { id: 13, username: "Aman", text: "🔥🔥🔥🔥🔥" },
      { id: 14, username: "Karan", text: "I was part of this 😏" },
      { id: 15, username: "Shruti", text: "You’re literally built different" },
    ],
  },
  {
    id: 2,
    username: "Kritika Singh",
    profileIcon: "UserIcon",
    content: "Sometimes the best ideas come when you’re just chilling at the canteen 😅☕",
    likes: 54,
    timeAgo: "5h ago",
    comments: [
      { id: 1, username: "Ananya", text: "Story of every college project 😂" },
      { id: 2, username: "Aarav", text: "Canteen + caffeine = innovation" },
    ],
  },
  {
    id: 3,
    username: "Rahul Verma",
    profileIcon: "UserIcon",
    content: "Campus fest next week! Expecting some crazy performances 🔥",
    image: { height: 300, width: 450 },
    likes: 230,
    timeAgo: "1d ago",
    comments: [
      { id: 1, username: "Megha", text: "Finallyyy! Been waiting for this" },
      { id: 2, username: "Dev", text: "Let’s gooo! 🎶" },
      { id: 3, username: "Sneha", text: "Tag the lineup pls" },
    ],
  },
  {
    id: 4,
    username: "Neha Gupta",
    profileIcon: "UserIcon",
    content: "The library was too quiet… until our group arrived 🤓📚",
    likes: 89,
    timeAgo: "3d ago",
    comments: [
      { id: 1, username: "Harshita", text: "Haha, classic 😂" },
      { id: 2, username: "Ravi", text: "The chaos squad strikes again!" },
    ],
  },
  {
    id: 5,
    username: "Aman Sharma",
    profileIcon: "UserIcon",
    content: "Monday mornings hit different when the assignment deadline is today 😭",
    image: { height: 280, width: 420 },
    likes: 65,
    timeAgo: "5d ago",
    comments: [
      { id: 1, username: "Sanya", text: "Bro I feel this in my soul 💀" },
      { id: 2, username: "Rohit", text: "Procrastinators unite… tomorrow." },
      { id: 3, username: "Tanya", text: "This meme potential is high 😂" },
    ],
  },
];
