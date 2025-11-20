const Form = require("@saltcorn/data/models/form");
const Field = require("@saltcorn/data/models/field");
const Table = require("@saltcorn/data/models/table");
const FieldRepeat = require("@saltcorn/data/models/fieldrepeat");
const Workflow = require("@saltcorn/data/models/workflow");

const configuration_workflow = () =>
  new Workflow({
    steps: [
      {
        name: "icons",
        form: async (context) => {
          return new Form({
            fields: [
              new FieldRepeat({
                name: "icons",
                fields: [
                  {
                    name: "short_name",
                    label: "Short name",
                    type: "String",
                    class: "validate-identifier",
                    required: true,
                    sublabel: "Must be a valid identifier",
                  },
                  {
                    name: "svg_file",
                    label: "SVG file",
                    type: "File",
                    required: true,
                    //fieldview: "select",
                    attributes: {
                      files_accept_filter: "image/svg+xml"
                    }
                  },
                ],
              }),
            ],
          });
        },
      },
    ],
  });

module.exports = {
  sc_plugin_api_version: 1,
  plugin_name: "svg-icons",
  configuration_workflow,
  headers: (cfg) => [
    {
      //https://stackoverflow.com/a/42443560
      style: `.svgi {
    background-repeat: no-repeat;
    background-size: cover;

    display: inline-block;
    height: 12px;
    width: 15px;
}
${(cfg?.icons || [])
        .map(
          ({ short_name, svg_file }) =>
            `.svgi-${short_name} { background-image: url('/files/serve/${svg_file}');}`
        )
        .join("\n")}`,
    },
  ],
  icons: (cfg)=>(cfg?.icons || []).map(({short_name}) => `svgi svgi-${short_name}`),
};
