import "./index.css";
import { MiniKit } from "https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@1.1.1/+esm";
import "./Verify";
import "./Pay";

MiniKit.install();

console.log(MiniKit.isInstalled());
