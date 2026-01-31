"use client";

interface PropertyMarkerProps {
  price: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PropertyMarker({
  price,
  isSelected,
  onClick,
}: PropertyMarkerProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-2 py-1 rounded-md text-xs font-semibold shadow-md transition-all
        ${
          isSelected
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-white text-gray-900 hover:bg-gray-100"
        }
      `}
    >
      {formatPrice(price)}
    </button>
  );
}
