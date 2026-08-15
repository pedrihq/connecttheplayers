import { ComponentPropsWithRef } from "react";

export function GameLogo(props: ComponentPropsWithRef<'div'>) {
    return (
        <div {...props}>
            <h1 className="w-full text-center text-5xl space-x-3">
                <span className="text-white">Connect</span>
                <span className="text-amber-400 font-extrabold">Players</span>
            </h1>
        </div>

    )
}