import { motion } from "framer-motion";

const Navbar = () => {
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Events", href: "#events" },
    { name: "My Events", href: "#my-events" },
    { name: "Account", href: "#account" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-white font-bold text-xl tracking-tighter"
        >
          LIVE<span className="text-accent">PDX</span>
        </motion.div>

        <ul className="flex items-center space-x-8">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <a
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
