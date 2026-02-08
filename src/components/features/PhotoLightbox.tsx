import type { Photo } from "../../data/gallery";
import Tag from "../ui/Tag";

export default function PhotoLightbox({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 backdrop-blur-sm transition-colors hover:text-gray-900"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full rounded-t-2xl object-cover"
          style={{ maxHeight: "50vh" }}
        />

        {/* Details */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {photo.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{photo.description}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span>{photo.location}</span>
            <span>{photo.date}</span>
          </div>
          {photo.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {photo.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
