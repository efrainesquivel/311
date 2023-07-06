import type { NullstackClientContext, NullstackNode } from 'nullstack';
import Nullstack from 'nullstack';
import '../tailwind.css';
import { Home } from './Home';

declare function Head(): NullstackNode

class Application extends Nullstack {
    prepare({ page }: NullstackClientContext) {
        page.locale = 'en-US';
    }

    renderHead() {
        return (
            <head>
                <link href="https://fonts.gstatic.com" rel="preconnect" />
                <link href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap" rel="stylesheet" />
            </head>
        );
    }

    render() {
        return (
            <body class="dark font-roboto">
                <div class="bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white">
                    <Head />

                    <main class="flex w-full h-screen mx-auto overflow-hidden">
                        <article class="w-full">
                            <Home route="/" />
                        </article>
                    </main>
                </div>
            </body>
        );
    }
}

export default Application;
