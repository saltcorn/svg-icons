const Form = require("@saltcorn/data/models/form");
const Field = require("@saltcorn/data/models/field");
const Table = require("@saltcorn/data/models/table");
const FieldRepeat = require("@saltcorn/data/models/fieldrepeat");
const Workflow = require("@saltcorn/data/models/workflow");
const { features } = require("@saltcorn/data/db/state");

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
                  features.file_fieldviews_cfg_workflows
                    ? {
                        name: "svg_file",
                        label: "SVG file name",
                        type: "File",
                        required: true,
                        fieldview: "select",
                        attributes: { file_exts: "svg", use_picker: true },
                      }
                    : {
                        name: "svg_file",
                        label: "SVG file name",
                        type: "String",
                        required: true,
                        sublabel: "Path to file in Saltcorn file store",
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
    display: inline-block;
    height: 12px;
    width: 15px;
}`,
    },
    {
      headerTag: `<script>function iconToSvg(nm){
        return {${(cfg?.icons || [])
          .map(
            ({ short_name, svg_file }) =>
              `${short_name}:'/files/serve/${svg_file}'`
          )
          .join(",")}}[nm]||""
      }</script>`,
    },
    {
      script: `/plugins/public/svg-icons@${
        require("./package.json").version
      }/svg-icons.js`,
    },
  ],
  icons: (cfg) =>
    (cfg?.icons || []).map(({ short_name }) => `svgi svgi-${short_name}`),
};
