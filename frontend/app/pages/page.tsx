export default function PagesIndex() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6 text-[#FC4308]">Pages</h1>
      <ul className="list-disc ml-6 text-gray-700 text-lg">
        <li className="mb-2">
          <a href="/about" className="underline text-blue-600">
            About
          </a>
        </li>
        <li className="mb-2">
          <a href="/contact" className="underline text-blue-600">
            Contact
          </a>
        </li>
        <li className="mb-2">
          <a href="/blog" className="underline text-blue-600">
            Blog
          </a>
        </li>
      </ul>
    </div>
  );
}
