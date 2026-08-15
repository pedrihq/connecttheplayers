import Lottie, { LottieComponentProps } from "lottie-react";

type RenderAnimationProps = {
    play?: boolean
    song?: any
} & LottieComponentProps

export function RenderAnimation({ play = false, song = null, ...lottieProps }: RenderAnimationProps) {
    if (!play) return <></>
    return (
        <div className="absolute bottom-0 left-0 w-full z-[-1]  ">
            {song && (
                <audio src={song} autoPlay loop />
            )}
            <Lottie {...lottieProps} />
        </div>
    )
}