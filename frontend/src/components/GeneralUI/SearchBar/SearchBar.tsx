'use client'
import { SearchIcon } from 'lucide-react';
import type { ChangeEvent, FC, FormEvent } from 'react';

interface SearchBarProps {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({
    onSubmit,
    value,
    onChange,
    placeholder = 'Search...',
}) => {
    return (
        <form onSubmit={onSubmit}
            className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 rounded-xl border-2 border-[#EBEEF7] bg-white px-3 py-2 md:flex-row">

            <div className='ml-4 flex w-full items-center gap-3'>

                <SearchIcon size={24} color="#00AAFF" />
                <input
                    type="search"
                    name="search"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full py-4 text-[#949AAD] outlinn-hidden "
                />

            </div>

            <button type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#00AAFF] px-5 py-2.5 text-lg text-white transition duration-300 ease-in-out hover:bg-[#037AB6] focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-hidden md:w-auto">

                <SearchIcon size={24}>Search</SearchIcon>

            </button>

        </form>
    )
}

export default SearchBar;