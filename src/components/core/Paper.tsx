import { loadEnvFile } from "process";

const Paper = ({ children, className, level }: { children: React.ReactNode, level: 1 | 2 | 3, className?: string }) => {
    switch (level) {
        case 1:
            return (
                <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl ${className}`}>
                    {children}
                </div>
            );
        case 2:
            return (
                <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl ${className}`}>
                    {children}
                </div>
            );
        case 3:
            return (
                <div className={`bg-white dark:bg-slate-700 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl ${className}`}>
                    {children}
                </div>
            );
    }
}

export default Paper