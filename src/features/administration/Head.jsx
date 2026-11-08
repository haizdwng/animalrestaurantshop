export default function Head({ title, sub, children }) {
  return (
    <div className='flex flex-wrap items-end justify-between gap-3'>
      <div>
        <h1 className='text-xl font-extrabold tracking-tight'>{title}</h1>
        {sub && <p className='mt-1 text-xs text-mute'>{sub}</p>}
      </div>
      {children}
    </div>
  );
};