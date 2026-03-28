import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listEmployees } from '../../actions/employeeActions';
import { SearchRounded, PersonRounded, CheckRounded } from '@mui/icons-material';

const MemberSelector = ({ selectedMembers = [], onSelect, onClose }) => {
    const dispatch = useDispatch();
    const { employees, loading } = useSelector((state) => state.employee);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(listEmployees());
    }, [dispatch]);

    const filteredEmployees = employees?.filter(emp => 
        emp.name?.toLowerCase().includes(search.toLowerCase()) || 
        emp.email?.toLowerCase().includes(search.toLowerCase())
    );

    const isSelected = (emp) => {
        const empId = emp._id || emp.id;
        if (!empId) return false;
        return selectedMembers.some(m => (m._id || m.id) === empId);
    };

    return (
        <div className="w-full bg-transparent overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4">
                <div className="relative group">
                    <SearchRounded className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#7b68ee] transition-colors" sx={{ fontSize: 16 }} />
                    <input 
                        autoFocus
                        type="text"
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50/50 border-none rounded-xl pl-10 pr-3 py-3 text-[13px] focus:ring-2 focus:ring-[#7b68ee]/10 font-bold placeholder-slate-300"
                    />
                </div>
            </div>
            
            <div className="max-h-52 overflow-y-auto pr-2 custom-scrollbar grid gap-1">
                {loading ? (
                    <div className="p-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Scanning Team...</div>
                ) : filteredEmployees?.length > 0 ? (
                    filteredEmployees.map((emp) => (
                        <button
                            key={emp._id || emp.id}
                            onClick={() => {
                                onSelect(emp);
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group ${
                                isSelected(emp)
                                ? 'bg-[#7b68ee]/5 border border-[#7b68ee]/10'
                                : 'hover:bg-slate-50/80 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-[#7b68ee]/20 uppercase">
                                    {emp.name?.charAt(0)}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className={`text-[12px] font-bold truncate transition-colors ${
                                        isSelected(emp)
                                        ? 'text-[#7b68ee]'
                                        : 'text-slate-600 group-hover:text-slate-900'
                                    }`}>{emp.name}</p>
                                    <p className="text-[10px] text-slate-300 truncate w-32 font-bold uppercase tracking-tight">{emp.email}</p>
                                </div>
                            </div>
                            {isSelected(emp) && (
                                <CheckRounded className="text-[#7b68ee]" sx={{ fontSize: 16 }} />
                            )}
                        </button>
                    ))
                ) : (
                    <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                        <PersonRounded className="text-slate-200 mb-3 mx-auto" sx={{ fontSize: 24 }} />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No members found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberSelector;
