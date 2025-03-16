// "use client"
// import React, { useEffect, useState } from "react";


// export const DynamicSvgIcon = ({
//     src,
//     isActive = false,
//     size = 19,
//     classname = ""
// }: {
//     src: string;
//     isActive: boolean;
//     size?: number;
//     classname?: string;
// }) => {
//     const [svgContent, setSvgContent] = useState<string>("");

//     useEffect(() => {
//         fetch(src)
//             .then(response => response.text())
//             .then(text => {
//                 // Replace fill and stroke colors based on active state
//                 const modifiedSvg = text
//                     .replace(/fill="[^"]*"/g, `fill="${isActive ? 'currentColor' : 'none'}"`)
//                     .replace(/stroke="[^"]*"/g, `stroke="currentColor"`)
//                     .replace(/stroke-width="[^"]*"/g, `stroke-width="1.5"`)
//                     .replace(/width="[^"]*"/, `width="${size}"`)
//                     .replace(/height="[^"]*"/, `height="${size}"`);
//                 setSvgContent(modifiedSvg);
//             });
//     }, [src, isActive, size]);

//     return (
//         <div
//             className={`transform group-hover:scale-110 transition-transform duration-300 ease-out ${classname} `}
//             dangerouslySetInnerHTML={{ __html: svgContent }}
//         />
//     );
// };



"use client"
import React, { useEffect, useState } from "react";

export const DynamicSvgIcon = ({
    src,
    isActive = false,
    size = 19,
    classname = "",
    increaseStrokeWidth = false
}: {
    src: string;
    isActive: boolean;
    size?: number;
    classname?: string;
    increaseStrokeWidth?: boolean;
}) => {
    const [svgContent, setSvgContent] = useState<string>("");

    useEffect(() => {
        fetch(src)
            .then(response => response.text())
            .then(text => {
                // Adjust stroke width dynamically
                const strokeWidth = increaseStrokeWidth ? "2.3" : "1.5";

                const modifiedSvg = text
                    .replace(/fill="[^"]*"/g, `fill="${isActive ? 'currentColor' : 'none'}"`)
                    .replace(/stroke="[^"]*"/g, `stroke="currentColor"`)
                    .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
                    .replace(/width="[^"]*"/, `width="${size}"`)
                    .replace(/height="[^"]*"/, `height="${size}"`);

                setSvgContent(modifiedSvg);
            });
    }, [src, isActive, size, increaseStrokeWidth]);

    return (
        <div
            className={`transform group-hover:scale-110 transition-transform duration-300 ease-out ${classname}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};
