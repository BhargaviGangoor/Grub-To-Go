type Props = {
  token: string;
  expiresIn: number; // seconds
};

export default function DCTDisplay({ token, expiresIn }: Props) {
  const minutes = Math.floor(expiresIn / 60);
  const seconds = expiresIn % 60;
  return (
    <div className="mt-4 p-4 bg-indigo-100 rounded">
      <p className="font-mono break-all">{token}</p>
      <p className="mt-1 text-sm">
        Expires in {minutes} m {seconds}s
      </p>
    </div>
  );
}
