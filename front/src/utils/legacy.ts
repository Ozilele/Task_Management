{/* <div 
tabIndex={0}
onBlur={() => setDropdownMenu(false)}
onClick={() => setDropdownMenu(!dropdownMenuOpen)} 
className='w-full relative flex justify-between items-center max-w-lg m-auto gap-1 text-lg bg-white h-11 border-2 border-transparent rounded-md focus:border-blue-500'
>
<span className='pl-2'>{stack}</span>
{dropdownMenuOpen && <ExpandMoreIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
{!dropdownMenuOpen && <ExpandLessIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
{dropdownMenuOpen && <DropdownList value={stack} setFunc={setStack} items={specializationItems}/> }
</div> */}