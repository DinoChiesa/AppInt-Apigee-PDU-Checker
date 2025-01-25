// the data looks like this:

// environmentToInstanceMappings = {
//   "org1/prod": ["instance2"],
//   "org1/test-env": ["instance1", "instance2"],
//   "org2/eval": ["instance3"],
// };
//

// deploymentCounts = [
//   [
//     {
//       "org1/prod": 1,
//     },
//     {
//       "org1/test-env": 6,
//     },
//   ],
//   [
//     {
//       "org2/eval": 43,
//     },
//   ],
// ];

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten,
    );
  }, []);
}

function executeScript(event) {
  var environmentToInstanceMappings = event.getParameter(
    "aggregatedEnvironmentToInstanceMappings",
  );
  var deploymentCounts = event.getParameter("aggregatedDeploymentCounts");
  var reducer = function (a1, c1) {
    var environments = Object.keys(c1);
    var r2 = function (a2, envName) {
      return (
        a2 +
        (c1[envName]
          ? c1[envName] * environmentToInstanceMappings[envName].length
          : 999)
      );
    };
    return a1 + environments.reduce(r2, 0);
  };

  environmentToInstanceMappings = environmentToInstanceMappings.reduce(
    function (acc, obj) {
      return Object.assign(acc, obj);
    },
    {},
  );
  event.setParameter(
    "reformedEnvironmentToInstanceMappings",
    JSON.stringify(environmentToInstanceMappings, null, 2),
  );

  deploymentCounts = flatten(deploymentCounts);
  event.setParameter(
    "flattenedDeploymentCounts",
    JSON.stringify(deploymentCounts, null, 2),
  );

  event.setParameter(
    "totalCount",
    deploymentCounts.reduce(reducer, 0).toFixed(0),
  );
  event.setParameter("now", new Date().toISOString());

  // copy CONFIG variables to avoid runtime bug b/385006505
  var value = null;
  value = event.getParameter("`CONFIG_alert_email_addr`");
  event.setParameter("emailAddress", value);
  value = event.getParameter("`CONFIG_tableHeaderBg`");
  event.setParameter("tableHeaderBg", value);
  value = event.getParameter("`CONFIG_tableHeaderFg`");
  event.setParameter("tableHeaderFg", value);
  event.setParameter("execId", event.getParameter("`ExecutionId`"));
}
