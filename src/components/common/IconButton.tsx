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
  iconPath: string;
  altIconPath?: string;
  iconSize?: number;
  text?: string;
  className?: string;
  spacing?: number;
  isActive?: boolean;
  isWhite?: boolean;
  title?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex ${isWhite ? (isActive ? "white" : "grey") : ""} ${className} cursor-pointer`}
      title={title}
      onClick={onClick}
    >
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
          className="icon self-center"
        />
        {altIconPath === "dot" && isActive && (
          <div className="absolute bottom-0 left-1.5 h-1 w-1 rounded-full bg-white"></div>
        )}
      </div>
      {text?.length && iconPath && <div style={{ width: spacing }} />}
      <div>{text}</div>
    </div>
  );
}
