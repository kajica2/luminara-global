import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { LiveState } from "@/components/LiveState";
import { Manifesto } from "@/components/Manifesto";
import { GetInvolved } from "@/components/GetInvolved";

export default function Page() {
  return (
    <>
      <Hero />
      <Pillars />
      <LiveState />
      <Manifesto />
      <GetInvolved />
    </>
  );
}
