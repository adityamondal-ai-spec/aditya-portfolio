import { EffectComposer, Bloom } from '@react-three/postprocessing'

// Its own module so it code-splits into a separate chunk, dynamically
// imported only when the full-viewport desktop takeover is active (see
// DecisionSpace3D.tsx). Mobile and the embedded-box path never fetch or
// parse this — @react-three/postprocessing's real measured cost (+16.76KB
// gzip) belongs only to the desktop experience that spends it.
export default function BloomEffect() {
  return (
    <EffectComposer>
      <Bloom intensity={0.4} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
    </EffectComposer>
  )
}
