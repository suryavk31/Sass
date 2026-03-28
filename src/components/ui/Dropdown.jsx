import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, items, align = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 z-[100] p-1.5 animate-in fade-in zoom-in-95 duration-200`}>
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className={`flex items-center w-full px-3 py-2 text-[12px] font-bold rounded-xl transition-all ${
                                    item.danger 
                                    ? 'text-red-500 hover:bg-red-50' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {item.icon && <span className="mr-3 text-slate-400 group-hover:text-inherit">{item.icon}</span>}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
