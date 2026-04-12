import { SCENE_OBJECTS, type SceneObjectId } from "../scene/config";

interface ObjectTooltipProps {
  activeId: SceneObjectId | null;
}

export default function ObjectTooltip({ activeId }: ObjectTooltipProps) {
  const target = SCENE_OBJECTS.find((item) => item.id === activeId) ?? SCENE_OBJECTS[0];

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/12 bg-slate-950/70 p-5 backdrop-blur-md">
      <p
        className="text-xs uppercase tracking-[0.28em]"
        style={{ color: target.accent }}
      >
        {target.caption}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{target.label}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {target.description}
      </p>
    </div>
  );
}
