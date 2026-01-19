export interface Project {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "kapture",
    description:
      "video editing in your browser. add zooms, trims, annotations, and export stunning videos.",
    url: "https://kapture-seven.vercel.app/",
    image: "/projects/Kapture.png",
  },
  {
    title: "ptransfer",
    description:
      "private sol transfer on devnet for secure and anonymous solana transactions.",
    url: "https://ptransfer.vercel.app/",
    image: "/projects/pTransfer.png",
  },
  {
    title: "sol-scan",
    description:
      "terminal wallet scanner for any wallet address with real-time balance tracking.",
    url: "https://github.com/0xNoushad/solana-address-checker",
    image: "/projects/sol-scan.png",
  },
  {
    title: "kebo",
    description:
      "tauri app for changing keyboard sound to mechanical or whatever user likes.",
    url: "https://www.kebo.space/",
    image: "/projects/kebo.jpeg",
  },
  {
    title: "downlo",
    description:
      "youtube video downloader with trimmer and auto shorts generator for content creators.",
    url: "https://github.com/0xNoushad/downlo",
    image: "/projects/downlo.png",
  },
  {
    title: "3dgenerator",
    description:
      "create 3d assets from image or via text easily with ai-powered generation.",
    url: "https://3d-generator-theta.vercel.app/",
    image: "/projects/3dgenerator.png",
  },
];
