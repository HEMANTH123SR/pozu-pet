"use client";
import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';
import { Card } from '@/components/ui/card';

interface EditorTools {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface RichTextEditorProps {
    onChange?: (data: OutputData) => void;
    defaultValue?: OutputData;
    value?: OutputData;
}

const RichTextEditor = ({ onChange, defaultValue, value }: RichTextEditorProps) => {
    const ejInstance = useRef<EditorJS | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isReady, setIsReady] = useState(false);
    // Add a ref to track if we need to update the editor content
    const shouldUpdateContent = useRef(false);

    const initializeTools = async (): Promise<EditorTools> => {
        const [
            Header,
            List,
            Code,
            Quote,
            Marker,
            InlineCode,
            LinkTool,
        ] = await Promise.all([
            import('@editorjs/header'),
            import('@editorjs/list'),
            import('@editorjs/code'),
            import('@editorjs/quote'),
            import('@editorjs/marker'),
            import('@editorjs/inline-code'),
            import('@editorjs/link'),
        ]);

        return {
            header: {
                class: Header.default,
                config: {
                    placeholder: 'Enter a header',
                    levels: [1, 2, 3],
                    defaultLevel: 1,
                },
            },
            list: {
                class: List.default,
                inlineToolbar: true,
                config: {
                    defaultStyle: 'unordered',
                },
            },
            code: {
                class: Code.default,
            },
            quote: {
                class: Quote.default,
                inlineToolbar: true,
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: "Quote's author",
                },
            },
            marker: {
                class: Marker.default,
            },
            inlineCode: {
                class: InlineCode.default,
            },
            linkTool: {
                class: LinkTool.default,
                config: {
                    endpoint: '/api/fetch-link-meta',
                },
            },
        };
    };

    const DEFAULT_INITIAL_DATA = {
        time: new Date().getTime(),
        blocks: [
            {
                type: "paragraph",
                data: {
                    text: "Start typing or press / for commands..."
                }
            }
        ]
    };

    // Initialize editor only once
    useEffect(() => {
        if (!ejInstance.current) {
            const initEditor = async () => {
                const EditorJS = (await import('@editorjs/editorjs')).default;
                const tools = await initializeTools();

                if (!ejInstance.current) {
                    const editor = new EditorJS({
                        holder: 'editor-js',
                        tools: tools,
                        data: value || defaultValue || DEFAULT_INITIAL_DATA,
                        placeholder: 'Type / for commands...',
                        onChange: async () => {
                            try {
                                const outputData = await editor.save();
                                shouldUpdateContent.current = false; // Reset the flag
                                onChange?.(outputData);
                            } catch (error) {
                                console.log('Failed to save data', error);
                            }
                        },
                        onReady: () => {
                            setIsReady(true);
                        },
                        autofocus: true,
                        inlineToolbar: ['bold', 'italic', 'marker', 'inlineCode', 'link'],
                    });

                    ejInstance.current = editor;
                }
            };

            initEditor();
        }

        return () => {
            if (ejInstance.current) {
                ejInstance.current.destroy();
                ejInstance.current = null;
            }
        };
    }, []); // Empty dependency array - only initialize once

    // Handle external value changes
    useEffect(() => {
        if (ejInstance.current && value && shouldUpdateContent.current) {
            ejInstance.current.render(value);
        }
        shouldUpdateContent.current = true;
    }, [value]);

    return (
        <Card className="w-full  mx-auto bg-background border-t border-b-0 ">
            <div className="p-4">
                <div id="editor-js" className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl" />
            </div>
        </Card>
    );
};

export default RichTextEditor;