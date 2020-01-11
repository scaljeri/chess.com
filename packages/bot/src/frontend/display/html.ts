export const HTML = `
    <style>
        .__display {
            border: 2px solid gray;
            box-shadow: 0px 0px 13px 7px rgba(220,20,60, .8);
            border-radius: 4px;
            width: 165px;
            height: auto;
            background-color: #fff;
            position:fixed;
            left:10px;
            bottom: 10px;
            z-index: 10000;
        }

        .__display.active {
            box-shadow: 0px 0px 13px 7px rgba(173,255,47, .8);
        }

        .__display .state, .__display .reload {
            border: 1px solid lightgray;
            border-radius: 3px;
            padding: 3px;
            position: absolute;
            right: 3px;
            top: 3px;
        }
    </style>
    <article class="box">
        <button onclick="__.get('eh').trigger('reload')" data-reload class="reload">Reload</button>

        <p class="tag is-black">
            <span>Score:</span> <span data-score-type></span> <span data-score-value></span>
        </p>
        <p class="tag is-black"><span>Book:</span> <span data-book-moves></span></p>
        <p class="tag is-black"><span>Ponderhits:</span> <span data-ponderhits></span></p>
        <p class="tag is-black"><span>Color: </span> <span data-color></span></p> 
    </article>
`