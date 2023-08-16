import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/modals/Product";

export default function HomePage({ featuredProduct, newProducts }) {
  // console.log("featuredroductId =>", featuredProduct);
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredroductId = "64a24f396ce92b32788b8622";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredroductId);
  // console.log("featuredroduct =>", featuredProduct);

  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
