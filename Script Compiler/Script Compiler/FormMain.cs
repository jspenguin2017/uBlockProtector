using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Script_Compiler
{
    public partial class FormMain : Form
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public FormMain()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Default git root directory
        /// </summary>
        private readonly string DefaultGitRoot = Path.Combine(Application.StartupPath, "..");

        /// <summary>
        /// Form load event handler
        /// Set default git root
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FormMain_Load(object sender, EventArgs e)
        {
            TBGitRoot.Text = DefaultGitRoot;
        }

        /// <summary>
        /// Build release button click handler
        /// Compile the release build
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void BtnBuildRelease_Click(object sender, EventArgs e)
        {
            //Lock UI
            string gitRoot = UpdateUI(false);
            //Start main process
            await Task.Run(() =>
            {
                //Build file
                string[] toWrite = Build(gitRoot);
                //Check if build failed
                if (toWrite.Length == 0)
                {
                    return;
                }
                //Write file
                try
                {
                    string path = Path.Combine(gitRoot, "uBlockProtector.user.js");
                    PutLog("Writting data to " + path);
                    File.WriteAllLines(path, toWrite);
                    PutLog(toWrite.Length.ToString() + " lines wrote.");
                }
                catch (Exception err)
                {
                    PutLog("Cannot write file, error message:");
                    PutLog(err.Message);
                    return;
                }
            });
            //Unlock UI
            UpdateUI(true);
        }

        /// <summary>
        /// Build dev button click handler
        /// Compile the dev build
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void BtnBuildDev_Click(object sender, EventArgs e)
        {
            //Lock UI
            string gitRoot = UpdateUI(false);
            //Start main process
            await Task.Run(() =>
            {
                //Build file
                string[] data = Build(gitRoot);
                //Check if build failed
                if (data.Length == 0)
                {
                    return;
                }
                //Copy to clipboard
                try
                {
                    //I need a new STA thread to access clipboard
                    Thread thread = new Thread(() =>
                    {
                        Clipboard.SetText(string.Join(Environment.NewLine, data));
                    });
                    thread.SetApartmentState(ApartmentState.STA);
                    thread.Start();
                    //Wait for the tread to end
                    thread.Join();
                    PutLog(data.Length.ToString() + " lines copied to clipboard.");
                }
                catch (Exception err)
                {
                    PutLog("Cannot copy to clipboard, error message:");
                    PutLog(err.Message);
                    return;
                }
            });
            //Unlock UI
            UpdateUI(true);
        }

        /// <summary>
        /// Build the script and returns it
        /// </summary>
        /// <param name="gitRoot">The git root</param>
        /// <returns>The build result, an empty array if failed</returns>
        private string[] Build(string gitRoot)
        {
            //Load everything into RAM
            if (LoadFile(Path.Combine(gitRoot, "Script Compiler\\Metadata.js"), false, out string[] metadata))
            {
                return new string[0];
            }
            if (LoadFile(Path.Combine(gitRoot, "Script Compiler\\jQuery\\jquery.factory-3.2.1.min.js"), false, out string[] jQuery))
            {
                return new string[0];
            }
            if (LoadFile(Path.Combine(gitRoot, "Script Compiler\\jQuery\\jquery.color.loader-2.1.2.min.js"), false, out string[] jQueryColor))
            {
                return new string[0];
            }
            if (LoadFile(Path.Combine(gitRoot, "Script Compiler\\Core.js"), true, out string[] core)) //AdBlock Protector Core
            {
                return new string[0];
            }
            if (LoadFile(Path.Combine(gitRoot, "Script Compiler\\Rules.js"), true, out string[] rules))
            {
                return new string[0];
            }
            //Put everything together
            string[] data = metadata.ToArray().Concat(jQuery).ToArray();
            //Uncomment the following line to enable the Color plug-in
            //data = data.Concat(jQueryColor).ToArray();
            PutLog("jQuery Color plug-in is not enabled.");
            data = data.Concat(core).ToArray(); //AdBlock Protector Core
            data = data.Concat(rules).ToArray();
            return data;
        }

        /// <summary>
        /// Lock or unlock UI, will return data in git root textbox
        /// </summary>
        /// <param name="enable">True to unlock UI, false to lock</param>
        /// <returns>Data in git root textbox</returns>
        private string UpdateUI(bool enable)
        {
            this.Enabled = enable;
            //Return git root
            return TBGitRoot.Text;
        }

        /// <summary>
        /// Safely load a file
        /// </summary>
        /// <param name="filePath">The path to the file to read</param>
        /// <param name="rmComments">Whether comments should be removed</param>
        /// <param name="data">The output variable</param>
        /// <returns>True if failed, false otherwise</returns>
        private bool LoadFile(string filePath, bool rmComments, out string[] data)
        {
            string[] dataRead;
            //Read file
            try
            {
                PutLog("Reading data from " + filePath + "...");
                dataRead = File.ReadAllLines(filePath);
                PutLog(dataRead.Length.ToString() + " lines read.");
                if (rmComments)
                {
                    //Remove comments
                    List<string> dataOut = new List<string>();
                    bool commentBlockFlag = false;
                    int counter = 0;
                    for (int i = 0; i < dataRead.Length; i++)
                    {
                        string line = dataRead[i].Trim();
                        //Skip comments
                        //This algorithm wouldn't work for every JS file, but it will work for ours
                        if ((line.StartsWith("//") && !line.StartsWith("//@pragma-keepline")) || line == string.Empty)
                        {
                            counter++;
                            continue;
                        }
                        if (line.StartsWith("/*"))
                        {
                            commentBlockFlag = true;
                        }
                        if (line.EndsWith("*/"))
                        {
                            counter++;
                            commentBlockFlag = false;
                            continue;
                        }
                        //Check flag and write to output
                        if (!commentBlockFlag)
                        {
                            dataOut.Add(dataRead[i]);
                        }
                        else
                        {
                            counter++;
                        }
                    }
                    PutLog(counter.ToString() + " comments removed.");
                    //Return result
                    data = dataOut.ToArray();
                    return false;
                }
                else
                {
                    //Directly return result
                    data = dataRead;
                    return false;
                }
            }
            catch (Exception err)
            {
                PutLog("Cannot read file, error message:");
                PutLog(err.Message);
                data = new string[0];
                return true;
            }
        }

        /// <summary>
        /// Write log into log textbox, a new line will be automatically added
        /// This method can be called from another thread
        /// </summary>
        /// <param name="msg">The message to write</param>
        private void PutLog(string msg)
        {
            if (TBLog.InvokeRequired)
            {
                Invoke((MethodInvoker)(() =>
                {
                    TBLog.Text += msg + Environment.NewLine;
                }));
            }
            else
            {
                TBLog.Text += msg + Environment.NewLine;
            }
        }
    }
}
