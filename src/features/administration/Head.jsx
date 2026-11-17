export default function Head({ title, sub, children }) {
  return (
    <header className='flex flex-wrap items-end justify-between gap-3'>
      <div className='min-w-0 space-y-1'>
        <h1 className='ui-heading'>{title}</h1>
        {sub && <p className='ui-description'>{sub}</p>}
      </div>
      {children}
    </header>
  );
};