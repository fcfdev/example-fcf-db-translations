var fcf = require("fcf");

fcf.module({
  name: "example-fcf-db-translations.js",
  dependencies: [
    "fcf:NServer/Application.js"
  ],
  module: function(application) {
    application.setSettings({
      port:                       8080,
      projectionDirectories:      ["projections"],
      packages:                   ["fcfManagement"],
      fileСaching:                true,
      dataClient: {
        defaultConnection: "default",
        connections: {
          default: {
            type: "mysql",
            host: "localhost",
            db:   "example-fcf-db-translations",
            user: "example-fcf-db-translations",
            pass: "example-fcf-db-translations",
          }
        },
      },
      onInitialize: function(a_event) {
        if (!a_event.error) {
          application.run();
        } else {
          console.error(a_event.error);
        }
      }
    });
    application.getRouter().append([
      {
        uri:        "",
        controller: "fcf:NServer/NControllers/Tmpl.js",
        source:     "templates/pages/main.tmpl",
      },
      {
        uri:        "favicon.ico",
        controller: "fcf:NServer/NControllers/File.js",
        source:     "favicon.ico",
      },
      {
        uri:      "/css/*",
        controller: "fcf:NServer/NControllers/File.js",
        source:     "css",
      },
      {
        uri:      "/templates/*",
        controller: "fcf:NServer/NControllers/File.js",
        source:     "templates",
      },
      {
        uri:      "/translations/*",
        controller: "fcf:NServer/NControllers/File.js",
        source:     "translations",
      },
    ]);

    application.initialize();

  }
});
