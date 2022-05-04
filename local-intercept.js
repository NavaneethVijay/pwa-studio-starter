const moduleOverrideWebpackPlugin = require('./src/webpack/moduleOverrideWebpackPlugin');
const componentOverrideMapping = require('./src/webpack/componentOverrideMapping')

function localIntercept(targets) {

    const {Targetables} = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);

    // Include our webpack plugin for overiding
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverrideWebpackPlugin(componentOverrideMapping).apply(compiler);
    })

    // 1. load the 'ProductFullDetail' component to be adjusted
    const ProductFullDetailComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js'
    );
    // 2. import the component that helps rendering CMS Blocks
    const CmsBlockGroup = ProductFullDetailComponent.addImport(
        "CmsBlockGroup from '@magento/venia-ui/lib/components/CmsBlock'"
    );
    // 3. render the CMS Block right after the Product's <Form /> component.
    ProductFullDetailComponent.insertAfterJSX(
        '<Form/>',
        `<${CmsBlockGroup} identifiers={['contact-us-info']} />`
    );


    // load the component to be customized
    // const ProductFullDetailComponent = targetables.reactComponent(
    //     '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js'
    // );

    // import the custom component in the component to be modified
    const ProductShortDescription = ProductFullDetailComponent.addImport(
        "ProductShortDescription from '@theme/components/ProductShortDescription'"
    );

    // insert the custom component that renders product's short description
    ProductFullDetailComponent.insertAfterJSX(
        '<section className={classes.title}>',
        `<${ProductShortDescription} url_key={product.url_key} />`
    );
}
module.exports = localIntercept;
