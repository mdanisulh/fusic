import Image from "next/image";

export default function IconButton({
  iconPath,
  altIconPath,
  iconSize = 24,
  text,
  className,
  spacing = 0,
  isActive = false,
  isWhite = true,
  title = "",
  onClick,
}: {
  iconPath?: string;
  altIconPath?: string;
  iconSize?: number;
  text?: string;
  className?: string;
  spacing?: number;
  isActive?: boolean;
  isWhite?: boolean;
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={`flex flex-shrink-0 ${isWhite ? (isActive ? "white" : "grey") : ""} ${className} cursor-pointer`}
      title={title}
      onClick={onClick}
    >
      {iconPath && (
        <div className="relative flex-col content-center">
          <Image
            src={
              isActive && altIconPath && altIconPath !== "dot"
                ? altIconPath
                : iconPath
            }
            alt={title}
            width={iconSize}
            height={iconSize}
            className="icon flex-shrink-0 self-center"
            priority
          />
          {altIconPath === "dot" && isActive && (
            <div className="absolute bottom-0 left-1.5 h-1 w-1 rounded-full bg-white"></div>
          )}
        </div>
      )}
      {text?.length && iconPath && <div style={{ width: spacing }} />}
      <div className="self-center">{text}</div>
    </div>
  );
}
