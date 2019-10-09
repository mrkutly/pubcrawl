import styled from 'styled-components'

export default () => (
	<LoadingStyles>
		<div id="wrapper">
			<div className="profile-main-loader">
				<div className="loader">
					<svg className="circular-loader" viewBox="25 25 50 50">
						<circle
							className="loader-path"
							cx="50"
							cy="50"
							r="20"
							fill="none"
							strokeWidth="2"
						/>
					</svg>
				</div>
			</div>
		</div>
	</LoadingStyles>
)

const LoadingStyles = styled.div`
	#wrapper {
		position: relative;
		height: 100%;
	}

	.profile-main-loader {
		left: 50%;
		margin-left: -100px;
		position: fixed;
		top: 50%;
		margin-top: -100px;
		width: 45px;
		z-index: 9000;
	}

	.profile-main-loader .loader {
		position: relative;
		margin: 0px auto;
		width: 200px;
		height: 200px;
	}
	.profile-main-loader .loader:before {
		content: '';
		display: block;
		padding-top: 100%;
	}

	.circular-loader {
		-webkit-animation: rotate 2s linear infinite;
		animation: rotate 2s linear infinite;
		height: 100%;
		-webkit-transform-origin: center center;
		-ms-transform-origin: center center;
		transform-origin: center center;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		margin: auto;
	}

	.loader-path {
		stroke-dasharray: 150, 200;
		stroke-dashoffset: -10;
		-webkit-animation: dash 1.5s ease-in-out infinite, color 3s ease-in-out infinite;
		animation: dash 1.5s ease-in-out infinite, color 3s ease-in-out infinite;
		stroke-linecap: round;
	}

	@-webkit-keyframes rotate {
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@keyframes rotate {
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@-webkit-keyframes dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -124;
		}
	}
	@keyframes dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -124;
		}
	}
	@-webkit-keyframes color {
		0% {
			stroke: ${props => props.theme.lightblue};
		}
		50% {
			stroke: ${props => props.theme.yellow};
		}
	}
	@keyframes color {
		0% {
			stroke: ${props => props.theme.lightblue};
		}
		50% {
			stroke: ${props => props.theme.yellow};
		}
	}
`
