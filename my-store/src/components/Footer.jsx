function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} MYSTORE. 保留所有权利。
        </p>
      </div>
    </footer>
  );
}

export default Footer;