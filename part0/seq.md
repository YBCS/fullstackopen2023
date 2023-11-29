
%% add these in md file in your submit repo


%% sequenceDiagram
%%     participant browser
%%     participant server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
%%     activate server
%%     server-->>browser: HTML document
%%     deactivate server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
%%     activate server
%%     server-->>browser: the css file
%%     deactivate server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
%%     activate server
%%     server-->>browser: the JavaScript file
%%     deactivate server

%%     Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
%%     activate server
%%     server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
%%     deactivate server

%%     Note right of browser: The browser executes the callback function that renders the notes

%% %% ex : 0.4 new note 
%% sequenceDiagram
%%     participant browser
%%     participant server

%%     Note right of browser: Submit a form in SPA

%%     browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
%%     activate server
%%     Note right of browser: Creates a note and trigger a redirect
%%     server-->>browser: notes
%%     deactivate server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
%%     activate server
%%     server-->>browser: the css file
%%     deactivate server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
%%     activate server
%%     server-->>browser: the JavaScript file
%%     deactivate server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
%%     activate server
%%     server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
%%     deactivate server
%%     Note right of browser: The browser executes the callback function that renders the notes

%% %% ex : 0.5 --> spa
%% sequenceDiagram
%%     participant browser
%%     participant server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
%%     activate server
%%     server-->>browser: HTML document
%%     deactivate server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
%%     activate server
%%     server-->>browser: the css file
%%     deactivate server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
%%     activate server
%%     server-->>browser: the JavaScript file
%%     deactivate server

%%     Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

%%     browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
%%     activate server
%%     server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
%%     deactivate server

%%     Note right of browser: The browser executes the callback function that renders the notes

%% %% ex : 0.6 --> spa new note
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Submit a form in SPA

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: Append note to existing notes
    server->>browser: STATUS 201 { message: 'note created' }
