import Example from "./Example";

export default function Welcome() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col item-center px-4 py-20 content-center">
        <h1 className="mt-20 text-4xl font-bold text-center">
            Welcome to Aivara
        </h1>
        <h3 className="mt-4 text-1.5xl font-bold text-center">
            The Future of AI-Powered Customer Assistance
        </h3>
        <Example />
    </div>
  );
}
