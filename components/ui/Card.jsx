import { Link } from "react-router-dom";

const Card = ({ title, link }) => {
  return (
    <Link
      to={link}
      className="card bg-white p-6 rounded-xl hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">Go to {title}</p>
    </Link>
  );
};

export default Card;
