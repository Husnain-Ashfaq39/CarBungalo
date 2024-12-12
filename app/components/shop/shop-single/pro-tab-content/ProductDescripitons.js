const ProductDescripitons = ({description}) => {
  return (
    <div className="product_single_content">
       <div dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
};

export default ProductDescripitons;
