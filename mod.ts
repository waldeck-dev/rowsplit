import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";
import { CsvFile } from "https://deno.land/x/csv_file/mod.ts";

interface IOptions {
  rows?: number | undefined;
  files?: number | undefined;
  name: string;
  ext: string;
}

await new Command()
  .name("rowsplit")
  .description("✂️ A CSV file splitter")
  .version("1.0.0")
  .arguments("<file:string>")
  .option("-r, --rows <rows:number>", "Number of rows per file", {
    conflicts: ["files"],
    required: true,
  })
  .option(
    "-f, --files <files:number>",
    "Number of file to output",
    { conflicts: ["rows"], required: true },
  )
  .option("-n, --name <name:string>", "Name of splitted file", {
    default: "split",
  })
  .option(
    "-x, --ext <ext:string>",
    "File extension to be used for splitted files",
    {
      default: "csv",
    },
  )
  .action(async (options: IOptions, ...args) => {
    const f = await validateInputFile(args);
    if (!f) return;

    const csv = new CsvFile(f, ";");

    const rows = [];
    for await (const row of csv) {
      rows.push(row);
    }

    csv.close();

    await splitRows(rows, options);
  })
  .parse(Deno.args);

async function validateInputFile(paths: string[]) {
  if (!Array.isArray(paths) || paths.length !== 1) {
    throwError(new Error("One input file is required"));
  }

  const path = paths[0];

  try {
    return await Deno.open(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throwError(new Error(`File not found: ${path}`));
    }
  }
}

async function splitRows(rows: string[][], options: IOptions) {
  const nFiles = fileToCreate(rows, options);

  const nRows = typeof options.rows === "number"
    ? options.rows
    : Math.ceil(rows.length / nFiles);

  for (let i = 0; i < nFiles; i++) {
    const slice = rows.slice(nRows * i, nRows * i + nRows);

    const filename = `./${getName(i + 1, options)}`;

    const output = new CsvFile(
      await Deno.open(filename, { create: true, write: true }),
      ";",
    );

    for (const row of slice) {
      await output.writeRecord(row);
    }

    output.close();
  }
}

function fileToCreate(rows: string[][], options: IOptions): number {
  let nFiles = 1;

  if (typeof options.files === "number") {
    if (options.files > rows.length) {
      throwError(
        new Error(
          `Cannot split ${rows.length} rows into ${options.files} files`,
        ),
      );
    } else if (options.files > 0) {
      nFiles = options.files;
    }
  } else if (typeof options.rows === "number") {
    if (options.rows < 1) {
      throwError(new Error("--rows must be greater than or equal to 1"));
    } else if (options.rows < rows.length) {
      nFiles = Math.ceil(rows.length / options.rows);
    }
  }

  return nFiles;
}

function getName(item: number, options: IOptions): string {
  return `${options.name}${item}.${options.ext}`;
}

function throwError(error: Error): void {
  console.error(colors.bold.yellow(error.message));
  Deno.exit(1);
}
