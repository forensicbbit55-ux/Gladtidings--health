// API endpoint for deleting a product
import { query } from '@lib/db'
;
;export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // Delete the product
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id])
    
    if (result.rowCount === 0) {
      return Response.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      message: 'Product deleted successfully',
      product: result.rows[0]
    })
    
  } catch (error) {
    console.error('Error deleting product:', error)
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to delete product'
    }, { status: 500 })
  }
};
