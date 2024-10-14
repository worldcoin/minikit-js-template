import "./index.css";
import { MiniKit } from "https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@0.0.38-internal-alpha/+esm";
import "./Verify";
import "./Pay";

MiniKit.install();

console.log(MiniKit.isInstalled());
