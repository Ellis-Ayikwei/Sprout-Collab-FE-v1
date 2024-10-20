import {
	faClockFour,
	faHandshake,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressBar from "@ramonak/react-progress-bar";
import joinCollab from "components/collabs/joinCollab";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCollaborations } from "../../redux/collabSlice";
import { GetColor1BasedOnProgress } from "../../utils/getColorBasedOnProgress";

const GenericCard = ({
	onClick,
	title,
	description,
	duration,
	progress,
	progressType = "circular",
	memberCount = 0,
	collaborationCount = 0,
	visibility,
	dateCreated,
	status,
	icon,
	isCollaboration = false,
	isMember = false,
	data,
	goalId,
}) => {
	const dispatch = useDispatch();
	const myData = useSelector((state) => state.login.myData);
	const color = GetColor1BasedOnProgress(progress || 0);
	const [isLoading, setIsLoading] = useState(false);

	// Memoize the onClick handler
	const handleClick = useCallback(() => {
		if (onClick) onClick();
	}, [onClick]);

	// Memoized function to join the collaboration
	const handleJoinCollab = useCallback(() => {
		if (data && myData) {
			setIsLoading(true);
			joinCollab(myData, data?.id).then((res) => {
				console.log("res", res);
				if (res?.status === 200) {
					toast.success("Successfully joined collaboration");
					dispatch(fetchCollaborations(data?.goal_id));

					setIsLoading(false);
				}
			});
		}
	}, [dispatch, myData, data]);

	return (
		<div
			className="generic-card !w-full"
			onClick={handleClick}
		>
			<div className="generic--details1">
				{icon && (
					<img
						src={icon}
						alt="Icon"
						className="growth--icon"
					/>
				)}
				<div className="generic-info">
					<div className="generic-info1">
						<h5 className="generic-info__name text-sm sm:text-base md:text-lg lg:text-xl xl:text-lg">
							{title}
						</h5>
						{description && (
							<p className="text-xs sm:text-sm lg:text-sm xl:text-xs text-gray-400">
								{description}
							</p>
						)}
					</div>

					{/* Progress Bar or Circular Progress */}
					{progress != null && progressType === "bar" && (
						<div className="generic--details2 generic-progress-bar w-full mb-1 mt-1">
							<ProgressBar
								completed={progress}
								maxCompleted={100}
								height="7px"
								baseBgColor={color.tintColor}
								bgColor={color.mainColor}
								labelSize="10px"
								className="w-full"
							/>
						</div>
					)}

					<ul className="generic-info2 w-full">
						{dateCreated && (
							<li className="generic-info__created_at text-xs sm:text-sm lg:text-sm xl:text-sm">
								{dateCreated}
							</li>
						)}
						{visibility && (
							<li className="generic-info__visibility text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
								{visibility}
							</li>
						)}
						<li>
							<span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-sm">
								<FontAwesomeIcon icon={faUserGroup} />
								{"  "}
								{memberCount}
							</span>
						</li>
						{collaborationCount > 0 && (
							<li>
								<FontAwesomeIcon icon={faHandshake} /> {"  "}
								<span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
									{collaborationCount}
								</span>
							</li>
						)}
						{duration && (
							<li>
								<FontAwesomeIcon icon={faClockFour} /> {"  "}
								<span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
									{duration} days
								</span>
							</li>
						)}
						{status && <li className="text-xs l">{status}</li>}
						{isCollaboration && !isMember && (
							<button
								onClick={handleJoinCollab}
								className="right-0 bg-main !rounded-full text-sm text-white px-4 ml-auto"
							>
								{isLoading ? "Joining...." : "Join"}
							</button>
						)}
					</ul>
				</div>

				{progress != null && progressType === "circular" && (
					<div className="generic-progress-circular">
						<CircularProgressbar
							value={progress}
							maxValue={100}
							text={`${progress}%`}
							styles={buildStyles({
								strokeLinecap: "round",
								textSize: "30px",
								pathTransitionDuration: 0.5,
								pathColor: `${color.mainColor}`,
								textColor: `${color.mainColor}`,
								trailColor: `${color.tintColor}`,
							})}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

// PropTypes validation
GenericCard.propTypes = {
	onClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	duration: PropTypes.number,
	progress: PropTypes.number,
	progressType: PropTypes.oneOf(["circular", "bar"]),
	memberCount: PropTypes.number,
	collaborationCount: PropTypes.number,
	visibility: PropTypes.string,
	dateCreated: PropTypes.string,
	status: PropTypes.string,
	icon: PropTypes.string,
	isCollaboration: PropTypes.bool,
	isMember: PropTypes.bool,
	data: PropTypes.object,
	goalId: PropTypes.string,
};

// Default Props
GenericCard.defaultProps = {
	progressType: "circular",
	memberCount: 0,
	collaborationCount: 0,
	isCollaboration: false,
	isMember: false,
};

export default GenericCard;
