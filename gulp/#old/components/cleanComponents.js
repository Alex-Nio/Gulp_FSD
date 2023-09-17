/* eslint-disable */
import gulp from 'gulp';
import filter from 'gulp-filter';
import chalk from 'chalk';
import * as glob from 'glob';
import fs from 'fs';
import path from 'path';

const componentsDir = 'src/html/components/';

async function scssImportsRemove() {
  const pageFiles = glob.sync('src/styles/scss/pages/**/*.scss');
  for (const pageFile of pageFiles) {
    const pageContent = fs.readFileSync(pageFile, 'utf8');
    let updatedPageContent = pageContent;

    const scssImportRegex =
      /@import\s+(["'])\.\.\/\.\.\/\.\.\/\.\.\/html\/components\/([\w-]+)\/([\w-]+)\.scss\1;/g;
    updatedPageContent = updatedPageContent.replace(
      scssImportRegex,
      (match, p1, component, file) => {
        const componentPath = path.join(
          'src',
          'html',
          'components',
          component,
          `${file}.scss`
        );
        if (fs.existsSync(componentPath)) {
          return match;
        } else {
          console.log(chalk.red.bgYellow.bold(`Удален импорт - ${match}`));
          return '';
        }
      }
    );

    fs.writeFileSync(pageFile, updatedPageContent);
  }
}

async function jsImportsRemove() {
  const jsPageFiles = glob.sync('src/styles/js/pages/**/*.js');
  for (const jsPageFile of jsPageFiles) {
    const jsPageContent = fs.readFileSync(jsPageFile, 'utf8');
    let updatedJsPageContent = jsPageContent;

    const jsImportRegex =
      /import\s+(['"])(?:\.\.\/)*html\/components\/([\w-]+)\/([\w-]+)\.js\1;/g;

    updatedJsPageContent = updatedJsPageContent.replace(
      jsImportRegex,
      (match, relativePath, component, file) => {
        const componentPath = path.join(
          'src',
          'html',
          'components',
          component,
          `${file}.js`
        );
        if (fs.existsSync(componentPath)) {
          return match;
        } else {
          console.log(chalk.red.bgYellow.bold(`Удален импорт - ${match}`));
          return '';
        }
      }
    );

    fs.writeFileSync(jsPageFile, updatedJsPageContent);
  }
}

async function removeEmpty(dir, isRecursive = false) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      await removeEmpty(filePath);
    } else {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim() === '') {
        console.log(
          chalk.red.bgYellow.bold(`Удален пустой файл - ${filePath}`)
        );
        fs.unlinkSync(filePath);
      }
    }
  }

  if (!isRecursive) {
    await jsImportsRemove();
    await scssImportsRemove();
  }

  const remainingFiles = fs.readdirSync(dir);
  if (remainingFiles.length === 0) {
    console.log(chalk.red.bgBlue.bold(`Удалена пустая папка - ${dir}`));
    fs.rmdirSync(dir);
  }
}

export async function cleanComponents() {
  await new Promise((resolve, reject) => {
    gulp
      .src(`${componentsDir}/**/*.{html,js,scss}`)
      .pipe(
        filter((file) => {
          return file.stat.size !== 0;
        })
      )
      .pipe(gulp.dest(`${componentsDir}`))
      .on('error', (err) => {
        console.error(err.message);
        reject(err);
      })
      .on('end', async () => {
        const components = fs.readdirSync(componentsDir);
        console.log(chalk.red('Components:'));
        components.forEach((component) => {
          console.log(`- ${component}`);
        });

        await removeEmpty(componentsDir, true);

        resolve();
      });
  });
}
