export const Input = (context) => {
    return (
        <input
            {...context}
            class={[
                'w-full lg:flex items-center py-1.5 pl-2 pr-3 text-sm shadow-sm leading-6 rounded-md ring-1',
                'ring-neutral-100/10 text-neutral-400',
                'dark:bg-neutral-700 dark:highlight-white/5 dark:hover:bg-neutral-700',
                'hover:ring-neutral-300',
            ]}
        />
    );
};
