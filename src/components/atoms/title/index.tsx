type TitleProps = {
	title: string;
};

export const Title = ({ title }: TitleProps) => {
	return (
		<div>
			<h3>{title}</h3>
		</div>
	);

};
