/**
 * WordPress dependencies
 */
import { registerCoreBlocks } from '@wordpress/block-library';
import { createBlock, registerBlockType, serialize } from '@wordpress/blocks';

registerCoreBlocks();

/**
 * External dependencies
 */
import '@testing-library/jest-dom/extend-expect';

/**
 * Internal dependencies.
 */
import { name, settings } from '../index';

// Make variables accessible for all tests.
let block;
let serializedBlock;

const baseAttributes = {
	gutter: 'medium',
};

const baseInnerBlocks = [
	createBlock( 'core/image', {
		url: 'https://wordpress.com/wp-content/uploads/1234/56/image-1.jpg',
		id: 1,
		link: 'https://wordpress.com/wp-content/uploads/1234/56/image-1.jpg',
	} ),
	createBlock( 'core/image', {
		url: 'https://wordpress.com/wp-content/uploads/1234/56/image-2.jpg',
		id: 2,
		link: 'https://wordpress.com/wp-content/uploads/1234/56/image-2.jpg',
	} ),
];

describe( 'coblocks/gallery-masonry', () => {
	beforeAll( () => {
		// Register the block.
		registerBlockType( name, { category: 'common', ...settings } );
	} );

	beforeEach( () => {
		// Create the block with the minimum attributes.
		block = createBlock( name, baseAttributes, baseInnerBlocks );
		// Reset the reused variables.
		serializedBlock = '';
	} );

	afterEach( () => {
		// Make a snapshot for each save function test to better detect deprecation needs.
		expect( serializedBlock ).toMatchSnapshot();
	} );

	it( 'should have `core/image` innerBlocks rendered', () => {
		serializedBlock = serialize( block );

		expect( serializedBlock ).toBeDefined();
		expect( serializedBlock ).toContain( 'src="https://wordpress.com/wp-content/uploads/1234/56/image-2.jpg"' );
		expect( serializedBlock ).toContain( 'wp:image' );
	} );

	it( 'should have className \'has-lightbox\' with lightbox enabled.', () => {
		block.attributes = { ...block.attributes, lightbox: true };
		serializedBlock = serialize( block );

		expect( serializedBlock ).toBeDefined();
		expect( serializedBlock ).toContain( 'has-lightbox' );
	} );

	it( 'should have caption with `core/image` and caption with `coblocks/masonry`.', () => {
		block.innerBlocks = [
			...block.innerBlocks,
			createBlock( 'core/image', {
				url: 'https://wordpress.com/wp-content/uploads/1234/56/image-3.jpg',
				id: 3,
				link: 'https://wordpress.com/wp-content/uploads/1234/56/image-3.jpg',
				caption: 'Test Caption',
			} ),
		];

		serializedBlock = serialize( block );

		expect( serializedBlock ).toBeDefined();
		expect( serializedBlock ).toContain( `src="https://wordpress.com/wp-content/uploads/1234/56/image-3.jpg"` );
		expect( serializedBlock ).toContain( '<figcaption>Test Caption</figcaption>' );
		expect( serializedBlock ).not.toContain( '<figcaption class="blocks-gallery-caption">' );

		block.attributes.caption = 'Masonry Caption';
		serializedBlock = serialize( block );

		expect( serializedBlock ).toContain( '<figcaption class="blocks-gallery-caption">' );
		expect( serializedBlock ).toContain( 'Masonry Caption' );
	} );

	it( 'should have className \'has-border-radius-10\' with radius set to 10.', () => {
		block.attributes = { ...block.attributes, radius: 0 };
		serializedBlock = serialize( block );

		expect( serializedBlock ).toBeDefined();
		expect( serializedBlock ).not.toContain( 'has-border-radius-10' );

		block.attributes = { ...block.attributes, radius: 10 };
		serializedBlock = serialize( block );

		expect( serializedBlock ).toBeDefined();
		expect( serializedBlock ).toContain( 'has-border-radius-10' );
	} );

	[ 'small', 'medium', 'large' ].forEach( ( gutter ) => {
		it( `should have className 'has-${ gutter }-gutter' with gutter set to '${ gutter }'.`, () => {
			block.attributes = { ...block.attributes, gutter };

			serializedBlock = serialize( block );

			expect( serializedBlock ).toBeDefined();
			expect( serializedBlock ).toContain( `has-${ gutter }-gutter` );
		} );
	} );

	[ 'grayscale', 'sepia', 'saturation', 'dim', 'vintage' ].forEach( ( filter ) => {
		it( `should have className \'has-filter-${ filter }\' with filter set to '${ filter }'.`, () => {
			block.attributes = { ...block.attributes, filter };
			serializedBlock = serialize( block );

			expect( serializedBlock ).toBeDefined();
			expect( serializedBlock ).toContain( `has-filter-${ filter }` );
		} );
	} );
} );
